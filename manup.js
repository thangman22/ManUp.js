// this is the object we build for an ajax call to get the content of the manifest
// it's a JSON, so we can parse it like a man-child
// verion 1.0
let manUpObject

// data objects
let validMetaValues = [{
  name: 'mobile-web-app-capable',
  manifestName: 'display'
}, {
  name: 'theme-color',
  manifestName: 'theme_color'
}, {
  name: 'apple-mobile-web-app-capable',
  manifestName: 'display'
}, {
  name: 'apple-mobile-web-app-title',
  manifestName: 'short_name'
}, {
  name: 'application-name',
  manifestName: 'short_name'
}, {
  name: 'msapplication-TileColor',
  manifestName: 'theme_color'
}, {
  name: 'msapplication-square70x70logo',
  manifestName: 'icons',
  imageSize: '70x70'
}, {
  name: 'msapplication-square150x150logo',
  manifestName: 'icons',
  imageSize: '150x150'
}, {
  name: 'msapplication-wide310x150logo',
  manifestName: 'icons',
  imageSize: '310x150'
}, {
  name: 'msapplication-square310x310logo',
  manifestName: 'icons',
  imageSize: '310x310'
}]

let validLinkValues = [{
  name: 'apple-touch-icon',
  manifestName: 'icons',
  imageSize: '152x152'
}, {
  name: 'apple-touch-icon',
  manifestName: 'icons',
  imageSize: '120x120'
}, {
  name: 'apple-touch-icon',
  manifestName: 'icons',
  imageSize: '76x76'
}, {
  name: 'apple-touch-icon',
  manifestName: 'icons',
  imageSize: '60x60'
}, {
  name: 'apple-touch-icon',
  manifestName: 'icons',
  imageSize: '57x57'
}, {
  name: 'apple-touch-icon',
  manifestName: 'icons',
  imageSize: '72x72'
}, {
  name: 'apple-touch-icon',
  manifestName: 'icons',
  imageSize: '114x114'
}, {
  name: 'icon',
  manifestName: 'icons',
  imageSize: '128x128'
}, {
  name: 'icon',
  manifestName: 'icons',
  imageSize: '192x192'
}]

let generateValidData = (validData) => {
  let validMetaList = validData.map(validMetaValue => {
    if (manUpObject[validMetaValue.manifestName]) {
      if (validMetaValue.manifestName === 'icons') {
        validMetaValue.content = getImageSrc(manUpObject.icons, validMetaValue.imageSize)
      } else {
        validMetaValue.content = manUpObject[validMetaValue.manifestName]
        if (validMetaValue.manifestName === 'display' && manUpObject.display === 'standalone') validMetaValue.content = 'yes'
      }
    }
    return validMetaValue
  })
  return validMetaList
}

let getImageSrc = function (imageArrays, imageSize) {
  let srcImage = imageArrays.filter(imageArray => {
    if (imageArray.sizes === imageSize) {
      return imageArray
    }
  })
  return srcImage[0].src
}

let generateMetaArray = function () {
  let tempMetaArrays = generateValidData(validMetaValues)
  let headTarget = document.getElementsByTagName('head')[0]
  tempMetaArrays.forEach(tempMetaArray => {
    if (tempMetaArray.content) {
      var metaTag = document.createElement('meta')
      metaTag.name = tempMetaArray.name
      metaTag.content = tempMetaArray.content
      headTarget.appendChild(metaTag)
    }
  })
}

let generateLinkArray = function () {
  var tempLinkArrays = generateValidData(validLinkValues)
  var headTarget = document.getElementsByTagName('head')[0]
  tempLinkArrays.forEach(tempLinkArray => {
    var linkTag = document.createElement('link')
    linkTag.setAttribute('rel', tempLinkArray.name)
    linkTag.setAttribute('sizes', tempLinkArray.imageSize)
    linkTag.setAttribute('href', tempLinkArray.content)
    headTarget.appendChild(linkTag)
  })
}

var generateObj = function (ajaxString) {
  manUpObject = JSON.parse(ajaxString)
  generateLinkArray()
  generateMetaArray()
}

let makeAjax = (url) => {
  let fullURL
  let pat = /^https?:\/\//i
  if (pat.test(url)) {
    fullURL = url
  } else {
    fullURL = window.location.hostname + url
  }

  if (self.fetch) {
    fetch(fullURL)
    .then(response => {
      return response.text()
    })
    .then((text) => {
      generateObj(text)
    })
  } else {
    var ajax = new XMLHttpRequest()
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4 && ajax.status === 200) generateObj(ajax.responseText)
    }
    ajax.open('GET', fullURL, true)
    ajax.send()
  }
}

let collectManifestObj = () => {
  let links = Array.from(document.getElementsByTagName('link'))
  links.forEach(link => {
    if (link.rel && link.rel === 'manifest') makeAjax(link.href)
  })
}

collectManifestObj()
