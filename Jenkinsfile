pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t my-app:${BUILD_NUMBER} .'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Running application container...'
                sh 'docker stop my-app-container || true'
                sh 'docker rm my-app-container || true'
                sh 'docker run -d --name my-app-container -p 80:80 my-app:${BUILD_NUMBER}'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
