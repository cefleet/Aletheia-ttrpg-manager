import { updateAppState } from "./admin.js";

export const loadFiles = async (category) => {
    const response = await fetch(`/uploads/${category}`);
    if (!response.ok) {
        alert('Failed to fetch uploaded files');
        return;
    }
    const files = await response.json();

    return files;
    
};

export const uploadFile = async(file, category, callback)=>{
    const formData = new FormData();
    formData.append('category', category);
    formData.append('file', file);//file must be last


    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('File uploaded successfully');
        await callback();
    } else {
        alert('Failed to upload file');
    }
}