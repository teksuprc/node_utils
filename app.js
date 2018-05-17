const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
const sharp = require('sharp');


const DIR = "C:\\Users\\chandlerru\\Documents\\DEV\\projects\\ng6-image-gallery\\src\\data\\images";
const THUMBDIR = "C:\\Users\\chandlerru\\Documents\\DEV\\projects\\ng6-image-gallery\\src\\data\\thumbs";


var Image = function(id,e,n,u,w,h,a,c,t,tw,th,l,cat) {
    return {
        "id": id,
        "ext": e,
        "name": n,
        "url": u,
        "width": w,
        "height": h,
        "aspect": a,
        "created": c,
        "thumbnail": t,
        "thumbWidth": tw,
        "thumbHeight": th,
        "label": l,
        "category": cat
    };
}

var categories = ['one', 'two', 'three', 'four', 'null', 'null', 'null'];

var cnt = 0;

var getAspectRatio = (w,h) => {
    if(w > h) {
        return w/h;
    }
    else if(h > w) {
        return h/w;
    }
    else if(w === h) {
        return 1;
    }
    return 0;
}

var getRandomCategory = () => {
    let r = Math.floor(Math.random() * 7);
    return categories[r];
}

var createThumbnail = (name, inFile, outFile) => {
    sharp(inFile).resize(200).toFile(outFile, (err, info) => {
        if(err)
            console.log(err);
    });
    var size = sizeOf(outFile);
    return {tw: size.width, th: size.height};
}

var readDir = (dirPath) => {
    return fs.readdirSync(dirPath).reduce((list, file) => {
        var inFile = path.join(dirPath, file);
        var outFile = path.join(THUMBDIR, file);
        var stats = fs.statSync(inFile);
        var cat = getRandomCategory();
        cat = (cat === 'null') ? null : cat;
        console.log(cat);

        var ext = path.extname(inFile);
        if(ext === '.mp4') {
            var img = new Image(cnt++, ext.substring(1), file, "../data/images/" + file, 0, 0, 0, stats.ctime.toISOString(), "../data/thumbs/" + file, 200, 200, file, cat);
            return list.concat(isDir ? readDir(inFile) : [img]);
        }

        var size = sizeOf(inFile);
        var aspect = getAspectRatio(size.width, size.height);
        var tsize = createThumbnail(file, inFile, outFile);
        var img = new Image(cnt++, ext.substring(1), file, "../data/images/" + file, size.width, size.height, aspect, stats.ctime.toISOString(), "../data/thumbs/" + file, tsize.tw, tsize.th, file, cat);
        var isDir = fs.statSync(inFile).isDirectory();
        return list.concat(isDir ? readDir(inFile) : [img]);
    }, []);
}

var list = readDir(DIR);
console.log("completed sucessfully");

fs.writeFile("images.json", JSON.stringify({"data": list}), (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('saved file');
});
