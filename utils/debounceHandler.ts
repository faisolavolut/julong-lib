export const debouncedHandler = <T>(
    callback: () => void | Promise<void>, // Bisa sinkron atau async
    delay: number
  ) => {
    let timeout: NodeJS.Timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          await callback();
        } catch (error) {
          console.error("Error in debounced function:", error);
        }
      }, delay);
    };
  };
  