pipeline {
    agent any

    environment {
        // REPLACE WITH YOUR ACTUAL DOCKER HUB USERNAME
        DOCKER_USER     = 'pranavjjjjj'
        IMAGE_NAME      = 'two-tier-app'
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
        DOCKER_CREDS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker Image: ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG} -t ${DOCKER_USER}/${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub and pushing images...'
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDS_ID}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh 'echo $PASS | docker login -u $USER --password-stdin'
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
                        sh 'docker logout'
                    }
                }
            }
        }

        stage('Deploy Application Stack') {
            steps {
                echo 'Deploying Node.js and PostgreSQL via Docker Compose...'
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        always {
            // Clean up old dangling images to preserve server disk space
            sh 'docker image prune -f || true'
            cleanWs()
        }
    }
}
