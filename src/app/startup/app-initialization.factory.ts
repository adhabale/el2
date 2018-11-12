import { StartupService } from "./startup.service";

export function AppInitializationFactory(startUpService: StartupService) {
    return () =>startUpService.load();
  }