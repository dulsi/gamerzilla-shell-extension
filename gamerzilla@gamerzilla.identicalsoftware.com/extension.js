/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Gamerzilla from 'gi://Gamerzilla';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init(ext) {
        super._init(0.0, _('Game Achievements Indicator'));

        this.add_child(new St.Icon({
            icon_name: 'input-gaming-symbolic',
            style_class: 'system-status-icon',
        }));
        this.extension = ext;
        this.settings = ext.getSettings();
        this.gamerzilla = new Gamerzilla.GamerzillaGobj({ url: this.settings.get_string("gamerzilla-url"), username: this.settings.get_string("username"), password: this.settings.get_string("password") });
        this.gamerzilla.serverstart();
        if ((this.settings.get_string("gamerzilla-url") != "") && (this.settings.get_boolean("auto-connect")))
            this.gamerzilla.connect();

        let item = new PopupMenu.PopupMenuItem(_('Connect'));
        item.connect('activate', () => {
            this.gamerzilla.connect();
        });
        this.menu.addMenuItem(item);
        item = new PopupMenu.PopupMenuItem(_('Preferences'));
        item.connect('activate', () => {
            this.extension.openPreferences();
        });
        this.menu.addMenuItem(item);
    }

    _onDestroy() {
        this.gamerzilla.serverstop();
        super._onDestroy();
    }
});

export default class GamerzillaExtension extends Extension {
    enable() {
        this._indicator = new Indicator(this);
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
