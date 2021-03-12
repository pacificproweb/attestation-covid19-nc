# Générateur de certificat de déplacement

## Développer

### Installer le projet

```console
git clone https://github.com/pacificproweb/attestation-covid19-nc.git
cd attestation-covid19-nc
npm i
npm start
```

## Générer et tester le code de production

### Tester le code de production en local

#### Générer le code de production pour tester que le build fonctionne en entier

```console
npm run build:dev
```

#### Tester le code de production en local

```console
npx serve dist
```

Et visiter http://localhost:5000

Le code à déployer sera le contenu du dossier `dist`

## Crédits

Ce projet a été réalisé à partir d'une copie du dépôt [attestation-deplacement-derogatoire-covid-19](https://github.com/LAB-MI/attestation-deplacement-derogatoire-covid-19) et adapté au besoin de l'attestation calédonienne.

Les projets open source suivants ont été utilisés pour le développement de ce
service :

- [PDF-LIB](https://pdf-lib.js.org/)
- [qrcode](https://github.com/soldair/node-qrcode)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/license)
