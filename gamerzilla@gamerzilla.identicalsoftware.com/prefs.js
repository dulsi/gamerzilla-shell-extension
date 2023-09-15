'use strict';

import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class MyExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Use the same GSettings schema as in `extension.js`
        const settings = this.getSettings();

        // Create a preferences page and group
        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup();
        page.add(group);

        // Create a new preferences row
        const row = new Adw.ActionRow({ title: 'Gamerzilla URL' });
        group.add(row);

        var buf = new Gtk.EntryBuffer;
        buf.set_text(settings.get_string("gamerzilla-url"), -1);
        const urlentry = new Gtk.Entry({
            buffer: buf
        });

        row.add_suffix(urlentry);
        row.activatable_widget = urlentry;

        const row2 = new Adw.ActionRow({ title: 'Username' });
        group.add(row2);
        var buf2 = new Gtk.EntryBuffer;
        buf2.set_text(settings.get_string("username"), -1);
        const usernameentry = new Gtk.Entry({
            buffer: buf2
        });

        row2.add_suffix(usernameentry);

        const row3 = new Adw.ActionRow({ title: 'Password' });
        group.add(row3);
        var buf3 = new Gtk.EntryBuffer;
        buf3.set_text(settings.get_string("password"), -1);
        const passwordentry = new Gtk.Entry({
            buffer: buf3
        });

        row3.add_suffix(passwordentry);

        const row4 = new Adw.ActionRow({ title: '' });
        group.add(row4);
        const button = new Gtk.Button({
            label: 'Save'
        });
        button.connect('clicked', () => {
            settings.set_string("gamerzilla-url", buf.text);
            settings.set_string("username", buf2.text);
            settings.set_string("password", buf3.text);
        });
        row4.add_suffix(button);

        const row5 = new Adw.ActionRow({ title: 'Automatic Connect' });
        group.add(row5);

        // Create the switch and bind its value to the `show-indicator` key
        const toggle = new Gtk.Switch({
            active: settings.get_boolean ('auto-connect'),
            valign: Gtk.Align.CENTER,
        });
        settings.bind(
            'auto-connect',
            toggle,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        // Add the switch to the row
        row5.add_suffix(toggle);
        row5.activatable_widget = toggle;

        // Add our page to the window
        window.add(page);
    }
}
