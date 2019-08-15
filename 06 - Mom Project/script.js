window.addEventListener('DOMContentLoaded', (event) => {
    let p = Array.from(document.getElementsByTagName("p"))
    let img = Array.from(document.getElementsByTagName("img"))
    
    // if a p tag contains no content besides an img tag, remove everything but the img tag.
    // if a p, h3, or h4 tag contains a bunch of styling, remove it. 
    // styling that follows an img tag can stay.
    // all span tags can go

    compareParagraphContents(p)
});

let compareParagraphContents = (p) => {
    console.log(p)
    let haveImages = p.filter(paragraph => paragraph.getElementsByTagName('img').length > 0)
    let wrongSpace = p.filter(paragraph => paragraph.innerHTML.includes("&nbsp;"))
    examinePWithImages(haveImages)
    examineWrongSpace(wrongSpace)
}


let examinePWithImages = (haveImages) => {

    let boldStyleImages = haveImages.filter(paragraph => paragraph.innerHTML.includes("<strong><img"))
    let italicStyleImages = haveImages.filter(paragraph => paragraph.innerHTML.includes("<em><img"))
    let underLineStyleImages = haveImages.filter(paragraph => paragraph.innerHTML.includes("<u><img"))

    console.log("Image with Bold Around It:", boldStyleImages)
    console.log("Image with Italic Around It:", italicStyleImages)
    console.log("Image with Italic Around It:", underLineStyleImages)

    boldStyleImages.forEach(p => p.innerHTML = p.innerHTML.replace("<strong>","").replace("</strong>",""))
    italicStyleImages.forEach(p => p.innerHTML = p.innerHTML.replace("<em>","").replace("</em>",""))    
    underLineStyleImages.forEach(p => p.innerHTML = p.innerHTML.replace("<u>","").replace("</u>",""))
    // console.log(emptyStyle.forEach(p={})
        // {return console.log("Paragraph from Empty Style Array:", p)}))
    // console.log(emptyStyle.forEach(p=>console.log(p))))
}

let examineWrongSpace = (wrongSpace) => {
    wrongSpace.forEach(p => p.innerHTML = p.innerHTML.replace("&nbsp;"," "))
}


// does a paragraph have an image? 


// 
