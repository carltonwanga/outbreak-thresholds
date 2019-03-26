import com.dsru.idsr.service.MeningitisThresholdComputationService

MeningitisThresholdComputationService meningitisThresholdComputationService = new MeningitisThresholdComputationService();
for (int i = 30; i<=52;i++){
    meningitisThresholdComputationService.computeMeningitisThresholds(i,2018);
}