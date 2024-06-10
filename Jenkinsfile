pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "aapmor-360api"
        DOCKER_TAG = "${DOCKER_IMAGE}:${BUILD_NUMBER}"
        CONTAINER_NAME = "aapmore-360-api-c"
        SCANNER_HOME=tool'sonar-scanner'
        PORT_MAPPING = "5000:5000"  // Replace with your desired port mapping
    }
    

    stages {
         stage('Stop and Remove Existing Container') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    sh "docker ps -a | grep ${CONTAINER_NAME} | awk '{print \$1}' | xargs -r docker stop"
                    sh "docker ps -a | grep ${CONTAINER_NAME} | awk '{print \$1}' | xargs -r docker rm"
                }
            }
        }
        stage("checkout"){
            steps{
              git branch: 'main', credentialsId: 'gitpass', url: 'https://github.com/github-aapmor/aapmor360-api.git'    
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    sh "docker build -t ${DOCKER_TAG} ."
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Run Docker container
                    sh "docker run -d -p ${PORT_MAPPING} --name ${CONTAINER_NAME} ${DOCKER_TAG}"
                }
            }
        }
        stage("sonarqube"){
            steps{
                withSonarQubeEnv('sonar-server'){
                    sh ''' $SCANNER_HOME/bin/sonar-scanner  -Dsonar.projectKey=aapmor-360-api -Dsonar.sources=. -Dsonar.host.url=http://192.168.0.122:9000 -Dsonar.token=sqp_2d46aa8b26dc34d831fa6558086f8552b11533a0'''
      }
   }
   }
    }

    post {
        success {
            echo 'Docker image build and container run successful!'
        }
        failure {
            echo 'Docker image build or container run failed!'
        }
    }
}
