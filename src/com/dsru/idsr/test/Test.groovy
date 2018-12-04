import com.dsru.idsr.service.MalariaThresholdsComputationService


for(int i = 1;i<=40;i++){
    println(new MalariaThresholdsComputationService().computeMalariaThresholds(i,2018));
}

