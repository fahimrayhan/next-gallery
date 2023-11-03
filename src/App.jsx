import { useEffect, useRef, useState } from "react";

function App() {

  const [file, setFile] = useState([]); // used to store image files
  const [hover, setHover] = useState(null); // used for having specific hovering effect
  const [selected, setSelected] = useState([]); // used for storing the selected image for deletion
  const DraggedItem = useRef(null);
  const PlacePoint = useRef(null);

  const imagesPath = process.env.PUBLIC_URL + '/images/';

    useEffect(() => {
        // List the images in the public/images folder
        const imageFiles = ['image-1.webp', 'image-2.webp', 'image-3.webp', 'image-4.webp', 'image-5.webp', 'image-6.webp', 'image-7.webp', 'image-8.webp', 'image-9.webp', 'image-10.jpeg', 'image-11.jpeg']; 
        setFile(imageFiles);
     }, []);


  // file drag & drop functions
  const handleFirstImage = (e, index)=>{
    DraggedItem.current = index
  
  }
  // Function to handle drag over event
  const handleDragOver = (e,index) => {
    e.preventDefault(); 

    // Check if e.currentTarget is a valid DOM element
    if (e.currentTarget) {
      // Add a drop shadow when hovering
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(24, 50, 0, 0.3)';
    }
  };

   // Function to handle drop event
  const handleDropEvent = (e, index) => {
    e.preventDefault();
    
    e.currentTarget.style.boxShadow  = 'none'; 
  };

  // Function to handle drag leave event
  const handleDragLeave = (e,index) => {
    e.preventDefault();

    // Check if e.currentTarget is a valid DOM element
    if (e.currentTarget) {
      // remove drop shadow 
      e.currentTarget.style.boxShadow = 'none'; 
      // console.log(e.target)
    }
  };

  // Adding new image functionalities
 
  // Function to handle drop images

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFile((prevFile) => [...prevFile, file.name]);

  };
  
// Dropping multiple images
  const handleDrop = (e) => {
    e.preventDefault(); // Prevent files from opening in the browser
     
    const droppedFiles = e.dataTransfer.files;

    // Simulate the upload process by adding the dropped files to the list of images
    const newFiles = Array.from(droppedFiles).map((file) => file.name);
    setFile((prevFile) => [...prevFile, ...newFiles]);
  };

  // sorting function
  const HandleSortImage = (e) => {
    let images = [...file];
    // get the draged item and remove from its current position
    const replacedImage = images.splice(DraggedItem.current, 1)[0];
    // switch the position if the draged item with the new positon
    images.splice(PlacePoint.current, 0, replacedImage);

    // reset the positions
    DraggedItem.current = null;
    PlacePoint.current = null;

    // update the file array
    setFile(images);
  };

  // select function for deletion
  const onSelect = (index) => {
    if (selected.includes(index)) {
      const items = selected;
      items.splice(selected.indexOf(index), 1);
      setSelected(items);
    } else setSelected((prevSelected) => [...prevSelected, index]);
  };

  // delete function
  const HandleDelete = () => {
    const images = [...file];
    selected.forEach((item) => {
      var img = file[item];
      img = images.indexOf(img);
      images.splice(img, 1);
    });
    setFile(images);
    setSelected([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-200 ">
      <div className="image-container border rounded-md bg-white  w-8/12">
        <div className="image-container-head py-5 px-8 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-600 whitespace-nowrap">
            {selected.length > 0 ? (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`w-5 h-5 mr-2 text-white bg-blue-600  ${
                    selected.length > 0 ? "" : "hidden"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                {selected.length + " Files selected"}
              </div>
            ) : (
              "Gallery"
            )}
          </h1>
          {selected.length > 0 && (
            <h1
              onClick={HandleDelete}
              className="text-red-500 font-semibold cursor-pointer border border-white hover:border-red-500 rounded-md mx-4 px-1 whitespace-nowrap"
            >
              Delete files
            </h1>
          )}
        </div>

        <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {/* Draggable divs */}
          {file.length > 0 &&
            file.map((file, index) => (
              <div
                onMouseEnter={() => {
                  setHover(index);
                }}
                onMouseLeave={() => {
                  setHover(null);
                }}
                draggable
                onDragStart={(e) => {handleFirstImage(e,index)}} // for drag event
                onDragEnter={(e) => (PlacePoint.current = index)} // for drag event
                onDragOver={(e) =>{handleDragOver(e,index)}}
                onDragLeave={(e) =>{handleDragLeave(e,index)}}
                onDragEnd={(e) =>{HandleSortImage(e,index)}}
                onDrop={(e) =>{ handleDropEvent(e,index)}} // for handling the after drag event
                key={index}
                className={`border-2  border-gray-300 rounded-md ${
                  index === 0 ? "w-full xs:w-96 xs:h-96 col-span-2 row-span-2" : " w-full xs:w-44 xs:h-44"
                  } relative overflow-hidden `}
              >

                {/* Image Overlay ~ Transparent */}
                <div
                 className={`absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-black opacity-0 transition duration-300 ease-out hover:opacity-70`}
                ></div>

                {/* Image Select Button */}
                <div
                  onClick={() => onSelect(index)}
                  className={`${
                    hover === index ? "bg-white" : ""
                  } w-6 h-6 rounded-md absolute top-5 left-5 cursor-pointer flex items-center justify-center overflow-hidden transition-all ease-out duration-300`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-6 h-6 text-white bg-blue-600 ${
                      selected.includes(index) ? "" : "hidden"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <img src={imagesPath + file} alt=""/>
              </div>
            ))}

          {/* Adding new image button */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="flex items-center justify-center w-full xs:w-44 xs:h-44"
          >
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer p-2">
            
            <div className="flex flex-col items-center justify-center ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mb-2 w-8 h-8 xs:w-4 xs:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p class="text-sm text-gray-500 dark:text-gray-400 whitespace-normal text-center"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            </div>
              <input
                onChange={handleImageUpload}
                type="file"
                className="hidden"
                accept="image/*"
                id="dropzone-file" 
                multiple
                
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;