// Manup verion 1.0
// forked from https://github.com/boyofgreen/ManUp.js
class ManUp {
  constructor () {
    this.validMetaValues = [{
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

    this.validLinkValues = [{
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
    this.collectManifestObj()
  }

  collectManifestObj () {
    let links = Array.from(document.getElementsByTagName('link'))
    links.forEach(link => {
      if (link.rel && link.rel === 'manifest') {
        this.makeAjax(link.href)
        return true
      }
    })
  }

  makeAjax (url) {
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
      .then(text => {
        this.generateObj(text)
      })
    } else {
      var ajax = new XMLHttpRequest()
      ajax.onreadystatechange = () => {
        if (ajax.readyState === 4 && ajax.status === 200) this.generateObj(ajax.responseText)
      }
      ajax.open('GET', fullURL, true)
      ajax.send()
    }
  }

  generateObj (ajaxString) {
    let manUpObject = JSON.parse(ajaxString)
    this.generateLinkArray(manUpObject)
    this.generateMetaArray(manUpObject)
  }

  generateMetaArray (manUpObject) {
    let tempMetaArrays = this.generateValidData(this.validMetaValues, manUpObject)
    let headTarget = document.getElementsByTagName('head')[0]
    tempMetaArrays.forEach(tempMetaArray => {
      let metaTag = document.createElement('meta')
      metaTag.name = tempMetaArray.name
      metaTag.content = tempMetaArray.content
      headTarget.appendChild(metaTag)
    })
  }

  generateLinkArray (manUpObject) {
    let tempLinkArrays = this.generateValidData(this.validLinkValues, manUpObject)
    let headTarget = document.getElementsByTagName('head')[0]
    tempLinkArrays.forEach(tempLinkArray => {
      let linkTag = document.createElement('link')
      linkTag.setAttribute('rel', tempLinkArray.name)
      linkTag.setAttribute('sizes', tempLinkArray.imageSize)
      linkTag.setAttribute('href', tempLinkArray.content)
      headTarget.appendChild(linkTag)
    })
  }

  generateValidData (validData, manUpObject) {
    return validData.map(validMetaValue => {
      if (manUpObject[validMetaValue.manifestName]) {
        if (validMetaValue.manifestName === 'icons') {
          validMetaValue.content = this.getImageSrc(manUpObject.icons, validMetaValue.imageSize)
        } else {
          validMetaValue.content = manUpObject[validMetaValue.manifestName]
          if (validMetaValue.manifestName === 'display' && manUpObject.display === 'standalone') validMetaValue.content = 'yes'
        }
      }
      return validMetaValue
    }).filter(element => {
      return element.content !== undefined
    })
  }

  getImageSrc (imageArrays, imageSize) {
    let srcImage = imageArrays.filter(imageArray => {
      if (imageArray.sizes === imageSize) {
        return imageArray
      }
    })
    return (srcImage && srcImage.length > 0) ? srcImage[0].src : undefined
  }
}


(function() {
  new ManUp()
}())
