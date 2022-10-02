const Image = require('@11ty/eleventy-img')
const path = require("path")

function imageShortCode(src, alt = "", captionClasses = "", imgClasses = "", sizes = "(min-width: 40em) 50vw, 100vw") {
  try {
    const options = {
      widths: [600, 640],
      formats: ['webp', 'jpeg', 'gif', 'png'],
      sharpOptions: {
        animated: true
      },
      filenameFormat: ((id, src, width, format, options) => {
        const extension = path.extname(src)
        const name = path.basename(src, extension)
        return `${name}-${width}w.${format}`
      }),
      urlPath: "/visuals_images/",
      outputDir: "./_site/visuals_images",
      useCache: false
    }
    Image(src, options)

    const imageAttributes = {
      class: imgClasses,
      alt,
      sizes,
      loading: 'lazy',
      decoding: 'async',
    }

    const metadata = Image.statsSync(src, options)
    const html = Image.generateHTML(metadata, imageAttributes, { whitespaceMode: 'inline' })
    return `<figure>${html}<figcaption class="${captionClasses}">${alt}</figcaption></figure>`
  } catch (error) {
    if(error.code === 'ENOENT' && error.syscall === 'stat') {
      const [originalImageFormat] = src.split('.').slice(-1)
      const differentImageFormat = originalImageFormat === 'png' ? 'jpeg' : 'png'
      const newSource = src.replace(originalImageFormat, differentImageFormat)
      imageShortCode(newSource, alt, captionClasses, imgClasses, sizes)
    } else {
      console.error(error)
    }
  }
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("visuals_images")
  eleventyConfig.addShortcode("image", imageShortCode);

}