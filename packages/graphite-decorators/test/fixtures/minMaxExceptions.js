export default {
  description: (item) => `Should change text ${item.type} to type Object ${item.type}`,
  fixtures: [
    {
      type: 'Boolean | min = 8',
      expectation: {
        type: Boolean,
      },
    },
    {
      type: 'Date | max = 8',
      expectation: {
        type: Date,
      },
    },
  ],
};
