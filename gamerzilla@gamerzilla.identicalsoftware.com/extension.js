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

const GETTEXT_DOMAIN = 'game-achievements-extension';

const Gio = imports.gi.Gio;
const { GObject, St } = imports.gi;
const Gamerzilla = imports.gi.Gamerzilla;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Game Achievements Indicator'));

        this.add_child(new St.Icon({
            icon_name: 'input-gaming-symbolic',
            style_class: 'system-status-icon',
        }));
        this.settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.gamerzilla');
        this.gamerzilla = new Gamerzilla.GamerzillaGobj({ url: this.settings.get_string("gamerzilla-url"), username: this.settings.get_string("username"), password: this.settings.get_string("password") });
        this.gamerzilla.serverstart();
        if ((this.settings.get_string("gamerzilla-url") != "") && (this.settings.get_boolean("auto-connect")))
            this.gamerzilla.connect();

        let item = new PopupMenu.PopupMenuItem(_('Connect'));
        item.connect('activate', () => {
            let ext = imports.misc.extensionUtils.getCurrentExtension();
            this.gamerzilla.connect();
        });
        this.menu.addMenuItem(item);
        item = new PopupMenu.PopupMenuItem(_('Preferences'));
        item.connect('activate', () => {
            ExtensionUtils.openPrefs();
        });
        this.menu.addMenuItem(item);
    }

    _onDestroy() {
        this.gamerzilla.serverstop();
        super._onDestroy();
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
