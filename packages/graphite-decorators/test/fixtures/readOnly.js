export default {
  description: (item) => `Should change text ${item.type} to type Object ${item.type} with attr readonly`,
  fixtures: [
    {
      type: 'String | readonly',
      expectation: {
        type: String,
        readonly: true,
      },
    },
    {
      type: '[String] | readonly',
      expectation: {
        type: [String],
        readonly: true,
      },
    },
    {
      type: 'Int | readonly',
      expectation: {
        type: Number,
        readonly: true,
      },
    },
    {
      type: '[Int] | readonly',
      expectation: {
        type: [Number],
        readonly: true,
      },
    },
    {
      type: 'Date | readonly',
      expectation: {
        type: Date,
        readonly: true,
      },
    },
    {
      type: 'Boolean | readonly',
      expectation: {
        type: Boolean,
        readonly: true,
      },
    },
  ],
};
