import { Command } from "commander"

const args = new Command()

args.option("-p <port>", "to specify port", 8080)
args.option("--mode <mode>", "to specify mode enviroment")

args.parse()
export default args.opts()