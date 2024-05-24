import { Command } from "commander";

const program = new Command();

program
  .version("0.0.1")
  .option("--db <env>", "Selecciona persistencia", "mongo")
  .option("--mode <env>", "Selecciona tu modo", "dev");

program.parse(process.argv);

export default program;
