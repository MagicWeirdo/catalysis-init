#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const spawn = require("cross-spawn");

if(process.argv.length < 4) {
  console.log("incorrect arguments, please refet to the manual");
}else {
  var args = process.argv;

  if(args[2] === "new") {
    var projectPath = path.join(process.cwd(), args[3]);

    fs.mkdirSync(projectPath);
    fs.mkdirSync(path.join(projectPath, "api"));
    fs.mkdirSync(path.join(projectPath, "api", "controllers"));
    fs.mkdirSync(path.join(projectPath, "api", "services"));
    fs.mkdirSync(path.join(projectPath, "api", "middlewares"));

    fs.mkdirSync(path.join(projectPath, "api", "websocket"));
    fs.writeFileSync(path.join(projectPath, "api", "websocket", "websocket.js"), "");

    var websocketReadStream = fs.createReadStream(path.join(__dirname, "template", "websocket.js"));
    var websocketWriteStream = fs.createWriteStream(path.join(projectPath, "api", "websocket", "websocket.js"));
    websocketReadStream.pipe(websocketWriteStream);

    fs.mkdirSync(path.join(projectPath, "config"));
    fs.writeFileSync(path.join(projectPath, "config", "setting.js"), "");

    var settingReadStream = fs.createReadStream(path.join(__dirname, "template", "setting.js"));
    var settingWriteStream = fs.createWriteStream(path.join(projectPath, "config", "setting.js"));
    settingReadStream.pipe(settingWriteStream);

    fs.mkdirSync(path.join(projectPath, "node_modules"));
    fs.mkdirSync(path.join(projectPath, "view"));
    fs.mkdirSync(path.join(projectPath, "static"));

    fs.writeFileSync(
      path.join(projectPath, "package.json"),
      "{\r\n" +
      "  \"name\": \"" + args[3] + "\",\r\n" +
      "  \"version\": \"" + "1.0.0" + "\",\r\n" +
      "  \"description\": \"" + "" + "\",\r\n" +
      "  \"main\": \"" + "app.js" + "\",\r\n" +
      "  \"author\": \"" + "<your name>" + "\",\r\n" +
      "  \"license\": \"" + "ISC" + "\",\r\n" +
      "  \"dependencies\": {\r\n" +
      "    \"catalysis\": \"" + "latest" + "\"\r\n" +
      "  }\r\n" +
      "}\r\n"
    );

    fs.writeFileSync(path.join(projectPath, "README.md"), "");

    var name = args[3] + "Server";
    fs.writeFileSync(
      path.join(projectPath, "app.js"),
      "const catalysis = require(\"catalysis\");\r\n\r\n" +
      "var " + name + " = catalysis();\r\n\r\n" +
      name + ".setBasePath(__dirname);\r\n" +
      name + ".run();\r\n"
    );

    // run npm command to install packages
    var npmInstall = spawn("npm", ["install"], { cwd: projectPath });

    var isError = false;

    npmInstall.stdout.on("data", function(data) {
      console.log(data.toString());
    });

    npmInstall.stderr.on("data", function(data) {
      console.log(data.toString());
    });

    npmInstall.on("close", function(code) {
      console.log("catalysis project " + args[3] + " is created");
    });
  }else {
    console.log("incorrect arguments, please refet to the manual");
  }
}
