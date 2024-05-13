const asciiOutput = document.getElementById("asciiOutput");

// Function to convert pixel to ASCII character
function pixelToAscii(r, g, b) {
    const brightness = (r + g + b) / 3;
    const asciiChars = "@%#*+=-:.";
    const index = Math.round((brightness / 255) * (asciiChars.length - 1));
    return asciiChars.charAt(index);
}


// Function to generate ASCII art from video frame
function generateAsciiArt(video) {
    const pixelation = 10;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let asciiArt = "";
    for (let i = 0; i < imageData.height; i += pixelation) {
        for (let j = 0; j < imageData.width; j+= (pixelation*0.45)) {
            const pixelIndex = (i * imageData.width + j) * 4;
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            asciiArt += pixelToAscii(r, g, b);
        }
        asciiArt += "\n";
    }
    return asciiArt;
}


// Update ASCII art continuously
function updateAsciiArt(video) {
    asciiOutput.textContent = generateAsciiArt(video);
    requestAnimationFrame(() => updateAsciiArt(video));
}

// Initialize webcam and start ASCII art generation
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        video.addEventListener("loadedmetadata", () => {
            const aspectRatio = video.videoWidth / video.videoHeight;
            let width = window.innerWidth;
            let height = window.innerHeight;
            if (width / height > aspectRatio) {
                width = height * aspectRatio;
            } else {
                height = width / aspectRatio;
            }
            video.style.width = width + "px";
            video.style.height = height + "px";
            document.body.appendChild(video); // Append video element to the document
            updateAsciiArt(video); // Start updating ASCII art
        });
    })
    .catch(error => {
        console.error("Error accessing the webcam: ", error);
    });