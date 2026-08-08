pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'your-dockerhub-username' // We will update/use this later
        APP_NAME = 'two-tier-web-app'
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Code Lint & Test') {
            steps {
                echo 'Validating application configuration...'
                sh 'node -v'
            }
        }

        stage('Build & Test Containers') {
            steps {
                echo 'Building container stack with Docker Compose...'
                sh 'docker compose build'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deploying two-tier application stack...'
                sh 'docker compose down'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! Application updated.'
        }
        failure {
            echo 'Pipeline failed! Check logs for details.'
        }
    }
}
