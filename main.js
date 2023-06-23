// Get video and canvas elements
const video = document.getElementById("videoElement");
video.style.width = document.width + "px";
video.style.height = document.height + "px";
video.setAttribute("autoplay", "");
video.setAttribute("muted", "");
video.setAttribute("playsinline", "");

// improve performance with willReadFrequently: true,
const canvas = document.getElementById("canvasElement");
const canvasCtx = canvas.getContext("2d", {
    willReadFrequently: true,
});
const highlightCanvas = document.getElementById("highlightCanvas");
const highlightCtx = highlightCanvas.getContext("2d", {
    willReadFrequently: true,
});

const scanner = new jscanify();

var constraints = {
    video: {
        // width: { ideal: 2480 },
        // height: { ideal: 3508 },
        width: { ideal: 1240 },
        // height: { ideal: 1754 },
        facingMode: { exact: "environment" },
    },
    audio: false,
};

// Request access to the camera
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
        // Set the video source as the camera stream
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.error("Error accessing the camera:", error);
    });

// When the video metadata is loaded, update canvas size and start rendering
video.addEventListener("loadedmetadata", function () {
    // Set the canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    highlightCanvas.width = video.videoWidth;
    highlightCanvas.height = video.videoHeight;

    // Start rendering frames
    setInterval(renderFrame, 10);
});

function renderFrame() {
    // Draw the current video frame onto the canvas
    canvasCtx.drawImage(video, 0, 0);

    // Apply jscanify effect and highlight the document
    const resultCanvas = scanner.highlightPaper(canvas);
    highlightCtx.clearRect(0, 0, highlightCanvas.width, highlightCanvas.height);
    highlightCtx.drawImage(resultCanvas, 0, 0);
}

// EXPORT THE IMAGE TAKEN FROM THE CANVAS TO PDF
import { jsPDF } from "jspdf";

const doc = new jsPDF();

function savePDF() {
    // fills the image to the entire page
    const extracted = scanner.extractPaper(canvas, 2480, 3508);

    doc.addImage(extracted, "PNG", 0, 0, doc.internal.pageSize.getWidth(), 0);
    // doc.addPage();
    doc.save("saved.pdf");
}

document.getElementById("myButton").addEventListener("click", savePDF);

// // import jscanify from "jscanify";
// // import sharp from "sharp";
// // import { jsPDF } from "jspdf";
// // import { loadImage } from "canvas";
// // import { writeFileSync } from "fs";

// const INPUT_PHOTO_PATH = "img/photo.jpg";
// const EXTRACTED_IMAGE_PATH = "img/extracted.jpg";
// const OUTPUT_IMAGE_PATH = "img/output.png";

// loadImage(INPUT_PHOTO_PATH).then((image) => {
//   const scanner = new jscanify();
//   scanner.loadOpenCV(function (cv) {
//     const highlighted = scanner.highlightPaper(image, {
//       color: "#FF00FF",
//       thickness: "20",
//     });
//     const extracted = scanner.extractPaper(image, 3508, 2480);
//     writeFileSync("img/highlighted.jpg", highlighted.toBuffer("image/jpeg"));
//     writeFileSync("img/extracted.jpg", extracted.toBuffer("image/jpeg"));

//     sharp(EXTRACTED_IMAGE_PATH)
//       .rotate(90) // make it greyscale
//       .greyscale() // make it greyscale
//       .linear(1.5, 0) // increase the contrast
//       .toFormat("png")
//       .png({ colors: 2 }) // reduce image to two colors
//       .toFile(OUTPUT_IMAGE_PATH, (err, info) => {
//         if (err) {
//           console.error("An error occurred while converting the image:", err);
//         } else {
//           console.log("Huzzah!");
//           console.log("Image converted successfully:", info);
//         }
//       });

//   });
// });
