import { generateQR } from './util'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const ys = {
  travail: 516,
  sante: 410,
  famille: 360,
  handicap: 478,
  judiciaire: 252,
  missions: 226,
  transit: 404,
  animaux: 370,
  courses: 464,
  sport: 320,
  rassemblement: 190,
  demarche: 145,
}

export async function generatePdf (profile, reasons, pdfBase) {
  const creationInstant = new Date()
  const creationDate = creationInstant.toLocaleDateString('fr-FR')
  const creationHour = creationInstant
    .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    .replace(':', 'h')

  const {
    lastname,
    firstname,
    birthday,
    placeofbirth,
    address,
    zipcode,
    city,
    datesortie,
    heuresortie,
  } = profile

  const data = [
    `Cree le: ${creationDate} a ${creationHour}`,
    `Nom: ${lastname}`,
    `Prenom: ${firstname}`,
    `Naissance: ${birthday} a ${placeofbirth}`,
    `Adresse: ${address} ${zipcode} ${city}`,
    `Sortie: ${datesortie} a ${heuresortie}`,
    `Motifs: ${reasons}`,
    '', // Pour ajouter un ; aussi au dernier élément
  ].join(';\n')

  const existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // set pdf metadata
  pdfDoc.setTitle('COVID-19 - Déclaration de déplacement')
  pdfDoc.setSubject('Attestation de déplacement dérogatoire')
  pdfDoc.setKeywords([
    'covid19',
    'covid-19',
    'attestation',
    'déclaration',
    'déplacement',
    'officielle',
    'gouvernement',
  ])
  pdfDoc.setProducer('2PW')
  pdfDoc.setCreator('')
  pdfDoc.setAuthor("Gouvernement de la Nouvelle-Calédonie")

  const page1 = pdfDoc.getPages()[0]

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const drawText = (text, x, y, size = 11) => {
    page1.drawText(text, { x, y, size, font })
  }

  drawText(`${firstname} ${lastname}`, 120, 600)
  drawText(birthday, 120, 585)
  // drawText(placeofbirth, 200, 585)
  drawText(`${address} ${zipcode} ${city}`, 130, 572)

  reasons
    .split(', ')
    .forEach(reason => {
      drawText('x', 72, ys[reason], 12)
    })

  let locationSize = getIdealFontSize(font, profile.city, 83, 7, 11)

  if (!locationSize) {
    alert(
      'Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.',
    )
    locationSize = 7
  }

  drawText(profile.city, 320, 203, locationSize)
  drawText(`${creationDate}`, 425, 203, 11)
  drawText(`${creationHour}`, 495, 203, 11)
  drawText(`${firstname} ${lastname}`, 350, 150, 11)

  // const shortCreationDate = `${creationDate.split('/')[0]}/${
  //   creationDate.split('/')[1]
  // }`
  // drawText(shortCreationDate, 314, 189, locationSize)

  // // Date création
  // drawText('Date de création:', 479, 130, 6)
  // drawText(`${creationDate} à ${creationHour}`, 470, 124, 6)

  const qrTitle1 = 'QR-code contenant les informations '
  const qrTitle2 = 'de votre attestation numérique'

  const generatedQR = await generateQR(data)

  const qrImage = await pdfDoc.embedPng(generatedQR)

  // page1.drawText(qrTitle1 + '\n' + qrTitle2, { x: 440, y: 630, size: 6, font, lineHeight: 10, color: rgb(1, 1, 1) })

  page1.drawImage(qrImage, {
    x: page1.getWidth() - 450,
    y: 130,
    width: 64,
    height: 64,
  })

  pdfDoc.addPage()
  const page2 = pdfDoc.getPages()[1]
  page2.drawText(qrTitle1 + qrTitle2, { x: 50, y: page2.getHeight() - 70, size: 11, font, color: rgb(1, 1, 1) })
  page2.drawImage(qrImage, {
    x: 50,
    y: page2.getHeight() - 390,
    width: 300,
    height: 300,
  })

  const pdfBytes = await pdfDoc.save()

  return new Blob([pdfBytes], { type: 'application/pdf' })
}

function getIdealFontSize (font, text, maxWidth, minSize, defaultSize) {
  let currentSize = defaultSize
  let textWidth = font.widthOfTextAtSize(text, defaultSize)

  while (textWidth > maxWidth && currentSize > minSize) {
    textWidth = font.widthOfTextAtSize(text, --currentSize)
  }

  return textWidth > maxWidth ? null : currentSize
}
