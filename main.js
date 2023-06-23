// import { jsPDF } from "jspdf"

// const doc = new jsPDF()

// doc.addImage('img/output.png' , 'PNG' , 0 , 0 , doc.internal.pageSize.getWidth() , 0)
// doc.addPage()

// function savePDF(){
//   doc.save("saved.pdf")
// }

// document.getElementById("myButton").addEventListener("click", savePDF);

// // import jscanify from "jscanify";
// // import sharp from "sharp";
// // import { jsPDF } from "jspdf";
// // import { loadImage } from "canvas";
// // import { writeFileSync } from "fs";j

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

const scanner = new jscanify();
const canvasCtx = canvas.getContext("2d");
const resultCtx = result.getContext("2d");
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();

        setInterval(() => {
            canvasCtx.drawImage(video, 0, 0);
            const resultCanvas = scanner.highlightPaper(canvas);
            resultCtx.drawImage(resultCanvas, 0, 0);
        }, 10);
    };
});

// When the video metadata is loaded, update canvas size and start rendering
video.addEventListener("loadedmetadata", function () {
    // Set the canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Start rendering frames
    renderFrame();
});
