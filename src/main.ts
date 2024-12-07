import "bootstrap/dist/css/bootstrap.min.css"

type Article = {
  id: number;
  title: string;
  author: string;
}

let articleList: Article[] = [];

// Fetch and display the articles
const articleInfoList = async () => {
  const contentDiv = document.getElementById("content");
  if (!contentDiv) return;

  contentDiv.innerHTML = ""; // Clear existing content
  console.log("Data: ", articleList);

  articleList.forEach(article => {
      const articleDiv = document.createElement("div");
      articleDiv.id = `article_${article.id}`;
      articleDiv.className = "info-box";
      articleDiv.innerHTML = `
          ID: ${article.id}, ${article.title}, ${article.author}
          <button id="delete_${article.id}" class="btn btn-danger">X</button>
      `;
      contentDiv.appendChild(articleDiv);

      // Attach event listener to delete button
      const deleteButton = document.getElementById(`delete_${article.id}`);
      deleteButton?.addEventListener("click", () => removeItem(article.id));
  });
};

// Fetch articles from the server
const fetchArticles = async () => {
  try {
      const response = await fetch("http://localhost:3000/articles");
      articleList = await response.json();
      console.log("Fetched data: ", articleList);
      articleInfoList();
  } catch (error) {
      console.error("Error fetching articles:", error);
  }
};

// Remove an article
const removeItem = async (id: number) => {
  try {
      await fetch(`http://localhost:3000/articles/${id}`, { method: "DELETE" });
      articleList = articleList.filter(article => article.id !== id);
      articleInfoList();
  } catch (error) {
      console.error("Error deleting article:", error);
  }
};

// Add a new article
const addArticle = async (event: SubmitEvent) => {
  event.preventDefault();
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const author = (document.getElementById("author") as HTMLInputElement).value;

  const formData = { title, author };

  try {
      const response = await fetch("http://localhost:3000/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
      });
      const newArticle = await response.json();
      console.log(`Data added: Title ${newArticle.title}, Author: ${newArticle.author}`);
      fetchArticles(); // Refresh the list
  } catch (error) {
      console.error("Error adding article:", error);
  }

  (document.getElementById("myForm") as HTMLFormElement).reset();
};

// Update an article
const updateArticle = async (event: SubmitEvent) => {
  event.preventDefault();
  const id = Number((document.getElementById("id") as HTMLInputElement).value);
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const author = (document.getElementById("author") as HTMLInputElement).value;

  const formData = { id, title, author };

  try {
      await fetch(`http://localhost:3000/articles`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
      });
      fetchArticles(); // Refresh the list
  } catch (error) {
      console.error("Error updating article:", error);
  }

  (document.getElementById("myUpdateForm") as HTMLFormElement).reset();
};

// Attach event listeners to forms
document.getElementById("myForm")?.addEventListener("submit", addArticle);
document.getElementById("myUpdateForm")?.addEventListener("submit", updateArticle);

// Initial fetch of articles
fetchArticles();
