const imageInput = document.getElementById("imageInput");
const analyzeButton = document.getElementById("analyzeButton");
const imagePreview = document.getElementById("imagePreview");
const resultText = document.getElementById("resultText");

// OpenAI API anahtarınızı buraya ekleyin
const OPENAI_API_KEY = "your-api-key-here";

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

analyzeButton.addEventListener("click", async () => {
  if (!imageInput.files.length) {
    alert("Lütfen bir görsel seçin");
    return;
  }

  try {
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analiz ediliyor...";

    const imageUrl = {
      url: imagePreview.src,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Bu görseli analiz et ve detaylı bir şekilde açıkla.",
              },
              {
                type: "image_url",
                image_url: imageUrl,
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "API yanıtında bir hata oluştu");
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("API yanıtı beklenmeyen formatta");
    }

    resultText.textContent = data.choices[0].message.content;
  } catch (error) {
    console.error("Hata detayı:", error);
    resultText.textContent = "Bir hata oluştu: " + error.message;
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.textContent = "Analiz Et";
  }
});
