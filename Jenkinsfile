pipeline{
    //  กำหนด ชื่อ,IP,.. ของ agent --> any : can run any agent
    agent any

    tools{}

    // 
    environment{

        ORGANIZATION = "odds-booking"
        REGISTRY = "swr.ap-southeast-2.myhuaweicloud.com"
        TAG = "${BRANCH_NAME}:${GIT_COMMIT}"
        BUILD_TAG = "${REGISTRY}/${ORGANIZATION}/${TAG}"

    }

    stages{
        stage("install dependency"){
            steps{
                sh "npm install"
            }
        }
        stage("unit test"){
            steps{
                sh "npm run test"
            }
        }
        stage("build image"){
            steps{
                sh "docker build --build-arg environment=${BRANCH_NAME} -t ${BUILD_TAG} ."
            }
        }
        stage("push docker image"){
            steps{
                sh """ 
                    docker login -u ap-southeast-2@H97WABNOA1NBRPW8INUL -p aa275bca967ab0e83dccf3c57efb23ff981d9cd8ae4c66089d4aa25cdf971292 ${REGISTRY}
                    docker push ${BUILD_TAG}
                """
            }
        }
        stage("deploy"){
            steps{
                sh  """
                        docker pull 
                        docker run 
                    """
            }
        }
    }
}