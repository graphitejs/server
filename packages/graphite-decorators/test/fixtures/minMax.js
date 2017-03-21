export default {
  description: (item) => `Should change text ${item.type} to type Object ${item.type} with attr min and max`,
  fixtures: [
    {
      type: 'Number | min = 8',
      expectation: {
        type: Number,
        min: 8,
      },
    },
    {
      type: 'Number | max = 8',
      expectation: {
        type: Number,
        max: 8,
      },
    },
    {
      type: 'String | min = 8',
      expectation: {
        type: String,
        minlength: 8,
      },
    },
    {
      type: 'String | max = 8',
      expectation: {
        type: String,
        maxlength: 8,
      },
    },
  ],
};
