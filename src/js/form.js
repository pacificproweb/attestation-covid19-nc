import 'bootstrap/dist/css/bootstrap.min.css'

import '../css/main.css'

import formData from '../form-data.json'

import { $, appendTo, createElement } from './dom-utils'

const createTitle = () => {
  const h2 = createElement('h2', { className: 'titre-2', innerHTML: 'Remplissez en ligne votre déclaration numérique : ' })
  const p = createElement('p', { className: 'msg-info', innerHTML: 'Tous les champs sont obligatoires.' })
  return [h2, p]
}
// createElement('div', { className: 'form-group' })

const createFormGroup = ({
  autocomplete = false,
  autofocus = false,
  inputmode,
  label,
  max,
  min,
  maxlength,
  minlength,
  name,
  pattern,
  placeholder = '',
  type = 'text',
}) => {
  const formGroup = createElement('div', { className: 'form-group' })
  const labelAttrs = {
    for: `field-${name}`,
    id: `field-${name}-label`,
    innerHTML: label,
  }
  const labelEl = createElement('label', labelAttrs)

  const inputGroup = createElement('div', { className: 'input-group align-items-center' })
  const inputAttrs = {
    autocomplete,
    autofocus,
    className: 'form-control',
    id: `field-${name}`,
    inputmode,
    min,
    max,
    minlength,
    maxlength,
    name,
    pattern,
    placeholder,
    required: true,
    type,
  }

  const input = createElement('input', inputAttrs)

  const validityAttrs = {
    className: 'validity',
  }
  const validity = createElement('span', validityAttrs)

  const example = createElement('p', { className: 'exemple  basis-100' })

  const appendToFormGroup = appendTo(formGroup)
  appendToFormGroup(labelEl)
  appendToFormGroup(inputGroup)

  const appendToInputGroup = appendTo(inputGroup)
  appendToInputGroup(input)
  appendToInputGroup(validity)
  appendToInputGroup(example)

  return formGroup
}

const createReasonField = (reasonData) => {
  const formReasonAttrs = { className: 'form-checkbox align-items-center' }
  const formReason = createElement('div', formReasonAttrs)
  const appendToReason = appendTo(formReason)

  const id = `checkbox-${reasonData.code}`
  const inputReasonAttrs = {
    className: 'form-check-input',
    type: 'checkbox',
    id,
    name: 'field-reason',
    value: reasonData.code,
  }
  const inputReason = createElement('input', inputReasonAttrs)

  const labelAttrs = { innerHTML: reasonData.label, className: 'form-checkbox-label', for: id }
  const label = createElement('label', labelAttrs)

  appendToReason([inputReason, label])
  return formReason
}

const createReasonFieldset = (reasonsData) => {
  const fieldsetAttrs = {
    id: 'reason-fieldset',
    className: 'fieldset',
  }

  const fieldset = createElement('fieldset', fieldsetAttrs)
  const appendToFieldset = appendTo(fieldset)

  const textSubscribeReasonAttrs = {
    innerHTML: 'certifie que mon déplacement est lié au motif suivant (cocher la case) autorisé par le décret no 2021-3538 du 8 mars 2021 portant diverses mesures relatives à la lutte contre la propagation du virus covid-19 à l\'intérieur de la nouvelle calédonie.  <a class="footnote" href="#footnote1">[1]</a>&nbsp;:',
  }
  const textSubscribeReason = createElement('p', textSubscribeReasonAttrs)

  const legendAttrs = {
    className: 'legend titre-3',
    innerHTML: 'Choisissez un motif de déplacement',
  }
  const legend = createElement('p', legendAttrs)

  const textAlertAttrs = { className: 'msg-alert hidden', innerHTML: 'Veuillez choisir un motif' }
  const textAlert = createElement('p', textAlertAttrs)

  const reasonsFields = reasonsData.items.map(createReasonField)

  appendToFieldset([textSubscribeReason, legend, textAlert, ...reasonsFields])
  // Créer un form-checkbox par motif
  return fieldset
}

const createReasonFieldsetQuarantine = (reasonsData) => {
  const fieldsetAttrs = {
    id: 'reason-fieldset',
    className: 'fieldset',
  }

  const fieldset = createElement('fieldset', fieldsetAttrs)
  const appendToFieldset = appendTo(fieldset)

  const textQuarantineAttrs = {
    className: 'legend titre-3',
    innerHTML: '',
  }

  const textQuarantine = createElement('p', textQuarantineAttrs)

  const textAlertAttrs = { className: 'msg-alert hidden', innerHTML: 'Veuillez choisir un motif' }
  const textAlert = createElement('p', textAlertAttrs)

  const reasonsFields = reasonsData.items.map(createReasonField)

  appendToFieldset([textQuarantine, textAlert, ...reasonsFields])
  // Créer un form-checkbox par motif
  return fieldset
}

export function createForm () {
  const form = $('#form-profile')
  // Évite de recréer le formulaire s'il est déjà créé par react-snap (ou un autre outil de prerender)
  if (form.innerHTML !== '') {
    return
  }

  const appendToForm = appendTo(form)

  const formFirstPart = formData
    .flat(1)
    .filter(field => field.key !== 'reason-curfew')
    .filter(field => field.key !== 'reason-quarantine')
    .filter(field => !field.isHidden)
    .map((field,
      index) => {
      const formGroup = createFormGroup({
        autofocus: index === 0,
        ...field,
        name: field.key,
      })

      return formGroup
    })

  const reasonsDataCurfew = formData
    .flat(1)
    .find(field => field.key === 'reason-curfew')

  const reasonsDataQuarantine = formData
    .flat(1)
    .find(field => field.key === 'reason-quarantine')

  const reasonFieldset = createReasonFieldset(reasonsDataCurfew)
  const reasonFieldsetQuarantine = createReasonFieldsetQuarantine(reasonsDataQuarantine)
  appendToForm([...createTitle(), ...formFirstPart, reasonFieldset, reasonFieldsetQuarantine])
}
