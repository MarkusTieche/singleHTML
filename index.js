#!/usr/bin/env node
// https://github.com/terser/html-minifier-terser

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const terser = require("terser");
const minify = require('html-minifier-terser').minify;

(function init(args)
{
    var myArgs = process.argv.slice(2);
    var outputFile = myArgs[0];
    var obfuscate = myArgs[1]; //TODO: OBFUSCATE?


    if (!fs.existsSync("./build")){
        fs.mkdirSync("./build");
    }

    createFile().then(html=>replaceScript(html)).then(html=>replaceStyle(html)).then(html=>saveFile(html));

    async function createFile()
    {
        var newFile = await getFile('./index.html');
        return newFile;
    }

    async function replaceScript(html)
    {
        var scriptTags = html.match(/<script[^>]+><[^>]script+>/g);
        
        if(scriptTags == null)
        {
            return html;
        }
        
        for (let i = 0; i < scriptTags.length; i++) 
        {
            console.log('- found: '+scriptTags[i]);
            if( scriptTags[i].match('src="([^"]+)"'))
            {
                var path = scriptTags[i].match('src="([^"]+)"')[1];
                await getFile('./'+path)
                .then(data=>{terser.minify(data,{mangle:true,format: { max_line_len:1000}})
                .then(result=>{html = html.replace(scriptTags[i],"<script>"+result.code+"</script>"),console.log('  - minifyJS & inject: '+path)})});
            }
        }

        return html;
    }

    async function replaceStyle(html)
    {
        var styleTags = html.match(/<link[^>]+>/g);
        if(styleTags == null)
        {
            return html;
        }
        for (let i = 0; i < styleTags.length; i++) 
        {
            console.log('- found: '+styleTags[i]);
            if( styleTags[i].match('href="([^"]+)"') )
            {
                var path = styleTags[i].match('href="([^"]+)"')[1];
                await getFile('./'+path).then(result=>{html = html.replace(styleTags[i],"<style>"+result+"</style>",console.log('   - inject: '+path))});
            }
        }

        return html;
    }

    function getFile(file) 
    {
        return readFile(file,'utf8');
    }

    async function saveFile(html)
    {   
       
        html = await minify(html, {
            minifyCSS: true,
            collapseWhitespace:true,
          });
        console.log("\nminify: "+outputFile);

        try {
            fs.unlinkSync("./build/"+outputFile)
            //file removed
        } catch(err) {
            //console.log(err)
        }
       

        fs.appendFile('./build/'+outputFile, html, function (err) {
            if (err) throw err;
            var stats = fs.statSync("./build/"+outputFile)
            var fileSizeInBytes = stats["size"]
            //Convert the file size to megabytes (optional)
            var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
            console.log('\x1b[32m%s\x1b[0m','\nSaved : build/'+outputFile,fileSizeInMegabytes+"mb");
        });
    }

    console.log("\x1b[35m%s\x1b[0m","Minify & Inject \n")
}());