export default {
  description: (item) => `Should change text ${item.type} to type Object ${item.type}`,
  fixtures: [
    {
      type: 'String',
      expectation: {
        type: String,
      },
    },
    {
      type: '[String]',
      expectation: {
        type: [String],
      },
    },
    {
      type: 'Int',
      expectation: {
        type: Number,
      },
    },
    {
      type: '[Int]',
      expectation: {
        type: [Number],
      },
    },
    {
      type: 'Date',
      expectation: {
        type: Date,
      },
    },
    {
      type: 'Boolean',
      expectation: {
        type: Boolean,
      },
    },
  ],
};
