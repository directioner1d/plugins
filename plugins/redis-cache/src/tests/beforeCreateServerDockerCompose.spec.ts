import { CreateServerDockerComposeParams, CreateServerDotEnvParams, DsgContext, VariableDictionary } from "@amplication/code-gen-types";
import { deepEqual } from "assert";
import { mock } from "jest-mock-extended";
import { name } from "../../package.json";
import RedisCachePlugin from "../index";
import * as utils from "../utils"
import { settings as defaultSettings } from "../../.amplicationrc.json"
import { Settings } from "../types";


describe("Testing beforeCreateServerDockerCompose hook", () => {
    let plugin: RedisCachePlugin;
    let context: DsgContext;
    let params: CreateServerDockerComposeParams;

    beforeEach(() => {
        plugin = new RedisCachePlugin();
        context = mock<DsgContext>({
            pluginInstallations: [{ npm: name }]
        });
        params = { fileContent: 'version: "3"', updateProperties: [], outputFileName: "docker-compose.yml" }
    });
    it("should correctly modify the updateProperties", () => {
        const { updateProperties } = plugin.beforeCreateServerDockerCompose(context, params)
        deepEqual(updateProperties, [{
            services: {
                redis: {
                    container_name: "${REDIS_HOST}",
                    image: "redis:6",
                    ports: "${REDIS_PORT}:6379",
                    volumes: ["redis:/data"]
                }
            },
            volumes: {
                redis: {
                    driver: "local"
                }
            }
        }])
    });
});