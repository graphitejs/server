import {
  capitalize,
  isFunction,
  isUndefined,
  noop,
} from 'lodash';

const types = {
  'String': String,
  '[String]': [String],
  'Int': Number,
  '[Int]': [Number],
  'Date': Date,
  'Boolean': Boolean,
};

export const getAttributes = (prop = '') => {
  const attrs = prop.replace(/\s+/g, '').split('|');
  let type = attrs[0];
  attrs[0].includes('[') ? type.charAt(2).toUpperCase() : type = capitalize(attrs[0]);
  return attrs;
}

// export const getDefaultValue = (descriptor = { initializer: noop }) => {
//   console.log("descriptor ",descriptor)
//   // if (isFunction(descriptor.initializer) && !isUndefined(descriptor.initializer())) {
//   //   const isObject = typeof descriptor.initializer() === 'object';
//   //   const data = descriptor.initializer();

//   //   if (isObject) {
//   //     if (data.default) {
//   //       obj[key] = Object.assign({}, obj[key], { default: data.default });
//   //     }

//   //     if (data.options) {
//   //       obj[key] = Object.assign({}, obj[key], { enum: data.options });
//   //     }
//   //   } else {
//   //     obj[key] = Object.assign({}, obj[key], { default: data });
//   //   }
//   // }
// }

const getTypes = (graphQl) => (key = '', prop = '') => {
  const currentTypes = graphQl.Types || '';
  const attrs = getAttributes(prop);
  return `${currentTypes} \n ${key}: ${attrs},`;
}

export const property = function(prop) {

  return (target, key, descriptor) => {
    const graphQl = target.graphQl || {};
    const updateTypes = getTypes(graphQl)(key, prop);

    const updategraphQl = {
      ...graphQl,
      Types: updateTypes,
    };

    target.graphQl = updategraphQl;
    // console.log("updateTypes ",updateTypes)
    // const isRequired = attrEquals.required ? '!' : '';
    // if (!attrEquals.readonly) {
    //   target.createTypes = `${currentCreateTypes} \n ${key}: ${typeAttr}${isRequired},`;
    //   target.updateTypes = `${currentUpdateTypes} \n ${key}: ${typeAttr}${isRequired},`;
    // }

    return descriptor
  };
};

