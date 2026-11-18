export const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";
export const SIDEBAR_CLASS = "sidebar-collapsed";

/** Inline script (run in <head>) that restores the saved sidebar state before the first paint. */
export const RESTORE_SIDEBAR_SCRIPT = `try{if(localStorage.getItem("${SIDEBAR_STORAGE_KEY}")==="1")document.documentElement.classList.add("${SIDEBAR_CLASS}")}catch(e){}`;
