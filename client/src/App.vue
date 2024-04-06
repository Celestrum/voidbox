<script setup lang="ts">
import FileUpload from "primevue/fileupload";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { ref, toRaw } from "vue";
const toast = useToast();

let showResult = ref("");

const uploader = async (ev: {
  files: File | File[];
}) => {
  console.log("running uploader", ev);
  showResult.value = "here";

  // if is not array, it didn't come from our file upload
  if (!Array.isArray(ev.files)) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Invalid file",
    });
    return;
  }
  if (ev.files.length > 1) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Only one file can be uploaded at a time",
    });
    return;
  }

  const file = toRaw(ev.files[0]);
  console.log("typeof file", typeof file, file)
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  // test for error
  if (!response.ok) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "File Upload Failed",
    });
    console.error("response", response.body);
    return;
  }

  let receivedData = await response.blob();
  const ext = receivedData.type.split("/")[1];
  console.log("ext", ext);

  const imageUrl = URL.createObjectURL(receivedData);
  console.log("imageUrl", imageUrl);
  showResult.value = imageUrl;


  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
  });

};

</script>

<template>
  <main v-if="showResult.length <= 0" class="w-screen h-screen flex flex-col justify-center items-center bg-slate-200">
    <h1 class="py-12 text-4xl font-bold text-center text-gray-800">upload yer files!</h1>
    <div class="card flex flex-col items-center justify-center w-full">
      <Toast />
      <FileUpload name="userUploaded" url="/upload" customUpload @uploader="uploader($event)" accept="image/*"
        :fileLimit="1" :maxFileSize="1000000" :auto="false" :showUploadButton="true" :pt="{
          input: 'hidden',
          root: {
            class: ['w-1/2']
          },
          buttonbar: {
            class: ['flex', 'flex-wrap', 'bg-gray-50', 'dark:bg-gray-800', 'text-white-800', 'p-5', 'gap-2', 'border', 'border-solid', 'border-gray-200', 'dark:border-gray-700', 'border-b-0', 'rounded-tr-lg', 'rounded-tl-lg', 'items-center', 'justify-around']
          },
          chooseButton: {
            class: ['relative', 'items-center inline-flex text-center align-bottom justify-center', 'px-2.5 py-1.5', 'rounded-md', 'text-sm', 'font-semibold', 'text-white', 'bg-primary-500 dark:bg-primary-400', 'border-primary-500 dark:border-primary-400', 'hover:bg-primary-600 dark:hover:bg-primary-300', 'overflow-hidden', 'cursor-pointer', 'tracking-wide', 'hover:tracking-wider', 'transition-all', 'duration-300', 'ease-in-out', 'transform', 'hover:-translate-y-0.5', 'hover:shadow-md', 'hover:bg-primary-600', 'hover:border-primary-600 dark:hover:border-primary-300', 'hover:ring-1', 'hover:ring-primary-500 dark:hover:ring-primary-400', 'hover:ring-offset-2', 'hover:ring-offset-gray-100 dark:hover:ring-offset-gray-700', 'hover:text-green-500'
            ]
          },
          chooseIcon: {
            class: ['mr-2', 'inline-block']
          },
          chooseButtonLabel: {
            class: ['flex-1', 'font-bold']
          },

          uploadButton: {
            icon: {
              class: ['mr-2', 'inline-block']
            },
            root: {
              class: ['relative', 'items-center inline-flex text-center align-bottom justify-center', 'px-2.5 py-1.5', 'rounded-md', 'text-sm', 'font-semibold', 'text-white', 'bg-primary-500 dark:bg-primary-400', 'border-primary-500 dark:border-primary-400', 'hover:bg-primary-600 dark:hover:bg-primary-300', 'overflow-hidden', 'cursor-pointer', 'tracking-wide', 'hover:tracking-wider', 'transition-all', 'duration-300', 'ease-in-out', 'transform', 'hover:-translate-y-0.5', 'dark:hover:bg-primary-300', 'hover:border-primary-600 dark:hover:border-primary-300', 'hover:shadow-md', 'hover:ring-1', 'hover:ring-primary-500 dark:hover:ring-primary-400', 'hover:ring-offset-2', 'hover:ring-offset-gray-100 dark:hover:ring-offset-gray-700', 'hover:text-purple-500'
              ]
            }
          },

          cancelButton: {
            icon: {
              class: ['mr-2', 'inline-block']
            },
            root: {
              class: ['hidden', 'relative', 'items-center inline-flex text-center align-bottom justify-center', 'px-2.5 py-1.5', 'rounded-md', 'text-sm', 'font-semibold', 'text-white', 'bg-primary-500 dark:bg-primary-400', 'border-primary-500 dark:border-primary-400', 'hover:bg-primary-600 dark:hover:bg-primary-300', 'overflow-hidden', 'cursor-pointer', 'tracking-wide', 'hover:tracking-wider', 'transition-all', 'duration-300', 'ease-in-out', 'transform', 'hover:-translate-y-0.5', 'hover:shadow-md', 'hover:bg-primary-600 dark:hover:bg-primary-300', 'hover:border-primary-600 dark:hover:border-primary-300', 'hover:text-white', 'hover:shadow-md', 'hover:ring-1', 'hover:ring-primary-500 dark:hover:ring-primary-400', 'hover:ring-offset-2', 'hover:ring-offset-gray-100 dark:hover:ring-offset-gray-700', 'hover:text-red-500'
              ]
            }
          },

          content: {
            class: ['relative', 'bg-gray-0', 'dark:bg-gray-900', 'text-gray-700', 'dark:text-white/80', 'p-8', 'border', 'border-gray-200', 'dark:border-gray-700', 'rounded-b-lg']
          },
          file: {
            class: ['flex', 'items-center', 'flex-wrap', 'p-4', 'mb-2', 'last:mb-0', 'border', 'border-gray-200', 'dark:border-gray-700', 'gap-2', 'rounded']
          },
          thumbnail: {
            class: 'shrink-0'
          },
          fileName: {
            class: 'mb-2 break-all'
          },
          fileSize: {
            class: 'mr-2'
          },
          actions: {
            class: 'mr-2 ml-auto'
          },
          progressbar: {
            root: {
              class: ['overflow-hidden', 'absolute top-0 left-0', 'border-0', 'h-2', 'rounded-md', 'w-full', 'bg-gray-100 dark:bg-gray-700']
            },
            value: {
              class: ['absolute flex items-center justify-center overflow-hidden', 'bg-primary-500 dark:bg-primary-400', 'm-0', 'h-full w-0', 'border-0', 'transition-width duration-1000 ease-in-out']
            }
          }
        }">
        <template #empty>
          <p>Share something that has a story...</p>
        </template>
      </FileUpload>
    </div>
  </main>
  <main v-else class="w-screen h-screen flex flex-col justify-center items-center bg-slate-200">
    <h1 class="py-12 text-4xl font-bold text-center text-gray-800">behold yer response</h1>
    <div class="card flex flex-col items-center justify-center p-4 rounded-md bg-gray-800 ring-1 min-w-[50%]">
      <img class="aspect-auto drop-shadow-sm shadow-purple-400 transition-all duration-500 ease-in-out max-w-5xl"
        :src="showResult" alt="result" />
      <button
        class="mt-8 px-4 py-2 text-white dark:bg-primary-400 rounded-md hover:bg-primary-600 dark:hover:bg-primary-300 transition-all duration-300 ease-in-out hover:ring-1 hover:ring-primary-500 dark:hover:ring-primary-400 text-2xl text-semibold tracking-tight bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 hover:ring-offset-2 hover:ring-offset-gray-100 dark:hover:ring-offset-gray-700"
        @click=" showResult = ''">
        Try Again?
      </button>
    </div>
  </main>
</template>
