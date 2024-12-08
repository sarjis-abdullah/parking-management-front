<template>
    <div>
      <!-- The element you want to export as an image -->
      <div ref="captureRef" class="capture-area">
        <h2>Export This Content</h2>
        <p>This content will be converted to an image.</p>
      </div>
  
      <!-- Button to trigger the export -->
      <button @click="exportImage">Export as Image</button>
    </div>
  </template>
  
  <script>
  import { toPng } from 'html-to-image';
  
  export default {
    setup() {
      const captureRef = ref(null);
  
      const exportImage = async () => {
        try {
          if (captureRef.value) {
            const dataUrl = await toPng(captureRef.value, {
            width: 220, // Adjust for approximate 58mm (220px ~ 58mm at 96dpi)
          });
  
            // Create a link and download the image
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'exported-content.png';
            link.click();
          }
        } catch (error) {
          console.error('Error exporting image:', error);
        }
      };
  
      return {
        captureRef,
        exportImage,
      };
    },
  };
  </script>
  
  <style scoped>
  .capture-area {
    padding: 20px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    text-align: center;
  }
  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 14px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  