const GITHUB_USER = "yourusername";

// 1. Load projects from the JSON file
async function loadProjects() {
  const list = document.getElementById("project-list");
  try {
    const response = await fetch("data/projects.json");
    const projects = await response.json();

    projects.forEach(project => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p><strong>Tech:</strong> ${project.tech.join(", ")}</p>
        ${project.link ? `<a href="${project.link}" target="_blank">View project</a>` : ""}`;
      list.appendChild(card);
    });
  } catch (error) {
    list.textContent = "Projects could not be loaded.";
  }
}

// 2. Load the 5 most recently updated repositories from the GitHub REST API
async function loadRepos() {
  const list = document.getElementById("repo-list");
  const url = `https://api.github.com/users/${jayveepcl}/repos?sort=updated&per_page=5`;
  try {
    const response = await fetch(url);          // HTTP GET request
    if (!response.ok) throw new Error(response.status);
    const repos = await response.json();        // JSON response

    if (repos.length === 0) {
      list.textContent = "No public repositories yet.";
      return;
    }
    repos.forEach(repo => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.textContent = repo.name;
      item.appendChild(link);
      item.append(` (${repo.language || "n/a"})`);
      list.appendChild(item);
    });
  } catch (error) {
    list.textContent = "GitHub data is unavailable right now.";
  }
}

// 3. Validate the contact form
document.getElementById("contact-form").addEventListener("submit", event => {
  event.preventDefault();   // stop the page from reloading
  const name = document.getElementById("name").value.trim();
  const status = document.getElementById("form-status");
  status.textContent = `Thank you, ${name}! Your message has been noted.`;
  event.target.reset();
});

loadProjects();
loadRepos();