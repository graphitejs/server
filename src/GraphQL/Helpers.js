const templateAtomicType = (key = '', [value, comment]) =>
  `
   "${comment}"
   ${key}: ${value}
  `

export const createSchemaType = (name = '') => (types = '') => {
  const properties = Object.entries(types).map(([key, definition]) => {
    return typeof definition === 'function' ? key : templateAtomicType(key, definition)
  })

  return `
    type ${name} {
      ${properties.join('')}
    }
  `
}

export const getDataParsed = (query = {}, split = '') => {
  return Object.entries(query).map(([definition, resolver]) => {
    const [key] = definition.split(split)
    return { definition, resolver: { [key]: resolver }}
  })
}

export const createRelations = (name = '') => (types) => {
  const properties = Object.entries(types).reduce((acum, [key, definition]) => {
    if (typeof definition === 'function') {
      const keyParsed = key.split(':')[0].trim()
      return { ...acum, [keyParsed]: definition }
    }

    return acum
  }, {})

  return { [name]: properties }
}
