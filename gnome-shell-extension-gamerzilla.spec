%global uuid gamerzilla@gamerzilla.identicalsoftware.com
%global min_gs_version 3.20

Name:           gnome-shell-extension-gamerzilla
Version:        0.1.2
Release:        %autorelease
Summary:        A gnome-shell extension to connect to gamerzilla
License:        GPL-2.0-or-later
URL:            https://github.com/dulsi/gamerzilla-shell-extension
Source0:        http://www.identicalsoftware.com/gamerzilla/gamerzilla-shell-extension-%{version}.tgz

BuildArch:      noarch
BuildRequires:  glib2
BuildRequires:  make
Requires:       gnome-shell-extension-common >= %{min_gs_version}
Requires:       gamerzillagobj

%description
Gamerzilla shell extension configures your gamerzilla connection
information and uploads achievements online.

%prep
%setup -q -n gamerzilla-shell-extension-%{version}/%{uuid}

%build

%install
mkdir -p %{buildroot}%{_datadir}/gnome-shell/extensions/%{uuid}
mkdir -p %{buildroot}%{_datadir}/glib-2.0/schemas
install -Dp -m 0644 {extension.js,metadata.json,stylesheet.css,prefs.js} \
    %{buildroot}%{_datadir}/gnome-shell/extensions/%{uuid}/
install -Dp -m 0644 schemas/org.gnome.shell.extensions.gamerzilla.gschema.xml \
    %{buildroot}%{_datadir}/glib-2.0/schemas/

# remove precompiled gschemas
rm -rf %{builddir}/%{_datadir}/gnome-shell/extensions/%{uuid}/schemas/

%files
%license ../LICENSE
%{_datadir}/gnome-shell/extensions/%{uuid}/
%{_datadir}/glib-2.0/schemas/org.gnome.shell.extensions.gamerzilla.gschema.xml

%changelog
%autochangelog
