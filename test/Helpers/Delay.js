export const delay = async(seconds = 1) =>
  new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
