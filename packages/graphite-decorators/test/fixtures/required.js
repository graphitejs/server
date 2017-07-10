export default {
  description: (item) => `Should change text ${item.type} to type Object ${item.type} with attr required`,
  fixtures: [
    {
      type: 'String | required',
      expectation: {
        type: String,
        required: true,
      },
    },
    {
      type: '[String] | required',
      expectation: {
        type: [String],
        required: true,
      },
    },
    {
      type: 'Int | required',
      expectation: {
        type: Number,
        required: true,
      },
    },
    {
      type: '[Int] | required',
      expectation: {
        type: [Number],
        required: true,
      },
    },
    {
      type: 'Date | required',
      expectation: {
        type: Date,
        required: true,
      },
    },
    {
      type: 'Boolean | required',
      expectation: {
        type: Boolean,
        required: true,
      },
    },
  ],
};
