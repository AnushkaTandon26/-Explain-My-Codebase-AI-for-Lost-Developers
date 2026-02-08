const simpleGit = require("simple-git");
const git = simpleGit();

const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// ---------------- ROOT ROUTE ----------------

app.get("/", (req, res) => {
    res.send("Backend working 🚀");
});


// ---------------- FILE SCANNER ----------------

function scanFiles(dir, fileList = []) {

    const ignore = [
        "node_modules",
        ".git",
        "dist",
        "build",
        ".next"
    ];

    const files = fs.readdirSync(dir);

    files.forEach((file) => {

        const fullPath = path.join(dir, file);

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {

            if (!ignore.includes(file)) {
                scanFiles(fullPath, fileList);
            }

        } else {

            fileList.push(fullPath);

        }

    });

    return fileList;
}


// ---------------- FRAMEWORK DETECTOR ----------------

function detectFramework(projectPath) {

    const packageJsonPath = path.join(projectPath, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        return "Unknown";
    }

    const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf-8")
    );

    const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };

    if (deps?.next) return "Next.js";
    if (deps?.react) return "React";
    if (deps?.express) return "Express";

    return "Node.js";
}
function detectEntryPoint(files) {

    const priority = [
        "index.js",
        "server.js",
        "app.js",
        "main.js",
        "index.ts",
        "main.ts"
    ];

    // avoid non-main folders
    const ignoreFolders = ["examples", "test", "tests", "docs"];

    for (let p of priority) {

        const found = files.find(file => {

            const name = path.basename(file);

            const ignored = ignoreFolders.some(folder =>
                file.includes(folder)
            );

            return name === p && !ignored;
        });

        if (found) return found;
    }

    return "Not found";
}
function detectFolderRoles(files) {

    const roles = {
        routes: [],
        controllers: [],
        services: [],
        components: [],
        models: [],
        middleware: [],
        pages: []
    };

    files.forEach(file => {


        const lower = file.toLowerCase().replaceAll("\\", "/");


        if (lower.includes("/routes/")) roles.routes.push(file);
        if (lower.includes("/controllers/")) roles.controllers.push(file);
        if (lower.includes("/services/")) roles.services.push(file);
        if (lower.includes("/components/")) roles.components.push(file);
        if (lower.includes("/models/")) roles.models.push(file);
        if (lower.includes("/middleware/")) roles.middleware.push(file);
        if (lower.includes("/pages/")) roles.pages.push(file);

    });

    return roles;
}
function generateArchitectureDiagram(roles) {

    let diagram = "graph TD\n";

    diagram += "Client --> EntryPoint\n";

    if (roles.routes.length) diagram += "EntryPoint --> Routes\n";
    if (roles.controllers.length) diagram += "Routes --> Controllers\n";
    if (roles.services.length) diagram += "Controllers --> Services\n";
    if (roles.models.length) diagram += "Services --> Models\n";

    return diagram;
}
function generateRuleBasedExplanation(framework, entryPoint, roles) {

    let summary = "";
    let architecture = "";
    let whereToStart = "";

    // ---------- Project Summary ----------

    if (framework === "Express") {
        summary = "This is a Node.js Express backend application designed to handle API requests and server-side logic.";
    } 
    else if (framework === "React") {
        summary = "This is a React frontend application focused on building user interfaces using components.";
    }
    else if (framework === "Next.js") {
        summary = "This is a Next.js full-stack application supporting server-side rendering and API routes.";
    }
    else {
        summary = "This is a JavaScript project with a standard Node.js structure.";
    }

    // ---------- Architecture Explanation ----------

    architecture = "Application structure detected:\n";

    if (roles.routes.length) {
        architecture += "- Routes folder handles API endpoints.\n";
    }

    if (roles.controllers.length) {
        architecture += "- Controllers manage request handling logic.\n";
    }

    if (roles.services.length) {
        architecture += "- Services contain business logic.\n";
    }

    if (roles.models.length) {
        architecture += "- Models manage database interactions.\n";
    }

    if (!roles.routes.length && !roles.controllers.length && !roles.services.length) {
        architecture += "- Standard project structure detected without layered folders.\n";
    }

    // ---------- Where To Start ----------

    if (entryPoint !== "Not found") {
        whereToStart = `Start reading from entry file: ${entryPoint}`;
    } else {
        whereToStart = "No clear entry point found. Start by checking main configuration or index files.";
    }

    return {
        projectSummary: summary,
        architectureExplanation: architecture,
        whereToStart
    };
}

function detectKeyFiles(projectPath, entryPoint, roles) {
    const keyFiles = [];
    const clean = (file) =>
        path.relative(projectPath, file).replaceAll("\\", "/");
    if (entryPoint !== "Not found") {
        keyFiles.push({
            file: clean(entryPoint),
            reason: "Main application entry point"
        });
    }

    if (roles.routes.length) {
        keyFiles.push({
            file: clean(roles.routes[0]),
            reason: "API routes definition"
        });
    }

    if (roles.controllers.length) {
        keyFiles.push({
            file: clean(roles.controllers[0]),
            reason: "Request handling logic"
        });
    }

    if (roles.models.length) {
        keyFiles.push({
            file: clean(roles.models[0]),
            reason: "Database models"
        });
    }

    return keyFiles;
}

//---------------------///
function generateDeveloperGuide(framework, entryPoint, roles) {

    const guide = [];

    if (entryPoint !== "Not found") {
        guide.push("Start by reading the main entry file.");
    }

    if (roles.routes.length) {
        guide.push("Explore the routes folder to understand API endpoints.");
    }

    if (roles.controllers.length) {
        guide.push("Check controllers to understand request handling logic.");
    }

    if (roles.services.length) {
        guide.push("Review services for business logic.");
    }

    if (roles.models.length) {
        guide.push("Look into models to understand database structure.");
    }

    if (framework === "React" || framework === "Next.js") {
        guide.push("Review components/pages to understand UI structure.");
    }

    return guide;
}




//---------------------------///
   


// ---------------- ANALYZE ROUTE ----------------
app.post("/analyze", async (req, res) => {

    const { repoUrl } = req.body;

    const reposFolder = path.join(__dirname, "repos");

    if (!fs.existsSync(reposFolder)) {
        fs.mkdirSync(reposFolder);
    }

    const projectPath = path.join(reposFolder, Date.now().toString());

    try {

        console.log("Cloning repo...");

        await git.clone(repoUrl, projectPath);

        console.log("Clone complete");

        // ⭐ scan files first
        const files = scanFiles(projectPath);

        // ⭐ detect framework FIRST
        const framework = detectFramework(projectPath);

        // ⭐ detect entry point
        const entryPoint = detectEntryPoint(files);

        // ⭐ detect folder roles
        const folderRoles = detectFolderRoles(files);

        // ⭐ architecture diagram
        const architectureDiagram = generateArchitectureDiagram(folderRoles);

        // ⭐ rule-based explanation
        const explanation = generateRuleBasedExplanation(
            framework,
            entryPoint,
            folderRoles
        );      
        const keyFiles = detectKeyFiles(
            projectPath,
            entryPoint,
            folderRoles
        );
        const developerGuide = generateDeveloperGuide(
            framework,
            entryPoint,
            folderRoles
        );



        console.log("Files found:", files.length);
       
        res.json({
        message: "Repo cloned successfully",
        framework,
        entryPoint,
        folderRoles,
        architectureDiagram,
        explanation,
        keyFiles,
        developerGuide,
        totalFiles: files.length,
        files: files.slice(0,20)
        });



    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Clone failed"
        });
    }
});



// ---------------- START SERVER ----------------

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
