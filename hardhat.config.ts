import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: {
      compilers: [
        {
          version: "0.4.21",
        },
        {
          version: "0.5.0",
        },
        {
          version: "0.8.18",
        },
        {
          version: "0.6.12",
        }
      ],
    },
};

export default config;
