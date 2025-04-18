# 🕵️‍♀️ SEO Meta Tag Visual Analyzer

An **interactive web scraping web application** that analyzes and visualizes the **SEO meta tags** of any website. Simply enter a website URL and get a complete SEO breakdown, including Google and social media previews, issues found, and actionable recommendations to improve your site’s SEO.

---

## 🚀 Features

### 🔍 SEO Meta Tag Analyzer  
- Enter any website URL to fetch and inspect its HTML using web scraping.
- Analyze critical SEO tags like `<title>`, `<meta name="description">`, Open Graph, and Twitter Card metadata.

### 📊 SEO Score Analysis  
- Visual SEO score presented in a circular graph displaying:
  - **Title Tag**
  - **Meta Description**
  - **Open Graph**
  - **Twitter Cards**

### 🖼 Google & Social Media Previews  
- Instantly preview how your site appears on:
  - Google Search Results
  - Facebook (Open Graph)
  - Twitter (Twitter Cards)

### 📑 Detailed SEO Insights  
- View all **detected meta tags**.
- Identify **issues found** in the markup.
- Receive **recommendations to improve** your website’s SEO.

---

## 🛠 Technologies Used

- **HTML**
- **CSS**
- **Tailwind CSS**
- **JavaScript**
- **Node.js**
- **Web Scraping Techniques**

---

## 📸 Screenshot Preview

![SEO Analyzer Screenshot](<img width="942" alt="SEOmetataganalyzer" src="https://github.com/user-attachments/assets/3ad403e2-6720-463e-ad9e-041a95a15618" />
.png)  


---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HadiqaAziz/SEO-Meta-Tag-Analyzer.git
   cd SEO-Meta-Tag-Analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Open your browser and go to:
   ```
   http://localhost:5000
   ```

> ⚠️ Note: Web scraping requires server-side fetching due to CORS restrictions. The Node.js backend handles HTML requests and parsing.

---

## 🧠 How It Works

1. User enters a website URL.
2. The Node.js backend fetches the HTML content of the target site.
3. The frontend parses and displays:
   - Meta tags
   - Visual SEO score
   - Google and social previews
4. Issues and improvement tips are generated based on best practices.

---

## 💡 Future Enhancements

- Add mobile and desktop view toggles in previews.
- Integrate Lighthouse or similar APIs for deeper analysis.
- Export SEO reports as PDF or CSV.

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Contributing

Pull requests are welcome! If you plan to make major changes, please open an issue to discuss your ideas first.

---
