export default {
  description: (item) => `Should change text ${item.type} to type Object ${item.type} with unique`,
  fixtures: [
    {
      type: 'String | unique',
      expectation: {
        type: String,
        unique: true,
      },
    },
    {
      type: '[String] | unique',
      expectation: {
        type: [String],
        unique: true,
      },
    },
    {
      type: 'Number | unique',
      expectation: {
        type: Number,
        unique: true,
      },
    },
    {
      type: '[Number] | unique',
      expectation: {
        type: [Number],
        unique: true,
      },
    },
    {
      type: 'Date | unique',
      expectation: {
        type: Date,
        unique: true,
      },
    },
    {
      type: 'Boolean | unique',
      expectation: {
        type: Boolean,
        unique: true,
      },
    },
  ],
};
