export default function bootstrap() {
  try {
    console.log("================================");
    console.log("🚀 Bootstraping application...");
    console.log("================================");
  } catch (error) {
    console.error("An error occurred during bootstrap: \n", error);
    process.exit(1);
  }
}
