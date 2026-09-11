pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Check') {
            steps {
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Container Status') {
            steps {
                sh 'docker compose ps'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    for i in {1..12}
                    do
                        echo "Health check attempt $i"

                        if curl -f http://127.0.0.1:4000/health
                        then
                            echo "Health check successful"
                            exit 0
                        fi

                        sleep 5
                    done

                    echo "Health check failed"
                    docker compose logs backend
                    exit 1
                '''
            }
        }
    }
}
