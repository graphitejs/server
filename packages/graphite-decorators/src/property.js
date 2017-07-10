import {
  capitalize,
  isFunction,
  isUndefined,
} from 'lodash';

const property = function(prop) {
  const types = {
    'String': String,
    '[String]': [String],
    'Int': Number,
    '[Int]': [Number],
    'Date': Date,
    'Boolean': Boolean,
  };

  return (target, key, descriptor) => {
    const attrs = prop.replace(/\s+/g, '').split('|');
    let typeAttr = attrs[0];

    if (attrs[0].includes('[')) {
      typeAttr.charAt(2).toUpperCase();
    } else {
      typeAttr = capitalize(attrs[0]);
    }

    const attrEquals = attrs.reduce((acum, attr) => {
      if (attr.includes('readonly')) {
        return Object.assign({}, acum, { readonly: true });
      }

      if (attr.includes('required')) {
        return Object.assign({}, acum, { required: true });
      }

      if (attr.includes('unique')) {
        return Object.assign({}, acum, { unique: true });
      }

      if (attr.includes('min') || attr.includes('max')) {
        const option = {
          'String': {
            min: 'minlength',
            max: 'maxlength',
          },
          'Int': {
            min: 'min',
            max: 'max',
          },
        }[typeAttr];

        if (!isUndefined(option)) {
          const split = attr.split('=');
          const obj = {};
          obj[option[split[0].trim()]] = parseInt(split[1].trim(), 10);
          return Object.assign({}, acum, obj);
        }
      }

      return acum;
    }, {});

    const obj = {};
    obj[key] = Object.assign({
      type: types[typeAttr],
    }, attrEquals);

    if (isFunction(descriptor.initializer) && !isUndefined(descriptor.initializer())) {
      const isObject = typeof descriptor.initializer() === 'object';
      const data = descriptor.initializer();

      if (isObject) {
        if (data.default) {
          obj[key] = Object.assign({}, obj[key], { default: data.default });
        }

        if (data.options) {
          obj[key] = Object.assign({}, obj[key], { enum: data.options });
        }
      } else {
        obj[key] = Object.assign({}, obj[key], { default: data });
      }
    }

    target.schema = Object.assign({}, target.schema, obj);

    const currentTypes = target.Types || '';
    const currentCreateTypes = target.createTypes || '';
    const currentUpdateTypes = target.updateTypes || '';
    target.Types = `${currentTypes} \n ${key}: ${typeAttr},`;
    const isRequired = attrEquals.required ? '!' : '';
    if (!attrEquals.readonly) {
      target.createTypes = `${currentCreateTypes} \n ${key}: ${typeAttr}${isRequired},`;
      target.updateTypes = `${currentUpdateTypes} \n ${key}: ${typeAttr}${isRequired},`;
    }
  };
};

export default property;
