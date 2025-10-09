<?php
// Verifica se o método de requisição é POST, ou seja, se o formulário foi enviado.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // =======================================================================
    // CONFIGURAÇÃO DO E-MAIL
    // =======================================================================
    
    // ** SEU E-MAIL AQUI **
    // Para onde a mensagem do formulário será enviada.
    $destinatario = "sinatro@msn.com";
    
    // ** E-MAIL DO REMETENTE (IMPORTANTE) **
    // É recomendado usar um e-mail do mesmo domínio do seu site
    // para evitar que a mensagem seja marcada como spam.
    // Por exemplo, se seu site é "meusite.com", use "contato@meusite.com".
    $remetente_email = "contato@seudominio.com"; // <-- TROQUE PELO SEU DOMÍNIO

    // =======================================================================
    
    // Captura e limpa os dados vindos do formulário para segurança
    $nome = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email_remetente = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $mensagem = htmlspecialchars(strip_tags(trim($_POST["message"])));
    
    // Validação para garantir que os campos não estão vazios e o e-mail é válido
    if (empty($nome) || !filter_var($email_remetente, FILTER_VALIDATE_EMAIL) || empty($mensagem)) {
        // Se algo estiver errado, exibe uma mensagem de erro e para a execução
        http_response_code(400); // Código de erro "Bad Request"
        echo "<h1>Erro no Envio</h1><p>Por favor, preencha todos os campos do formulário corretamente.</p>";
        exit;
    }
    
    // Monta o Assunto e o Corpo do E-mail que você receberá
    $assunto = "Nova Mensagem do Site vinda de: $nome";
    
    $corpo_email = "Você recebeu uma nova mensagem através do formulário de contato do seu site.\n\n";
    $corpo_email .= "Nome: " . $nome . "\n";
    $corpo_email .= "E-mail do remetente: " . $email_remetente . "\n";
    $corpo_email .= "Mensagem:\n" . $mensagem . "\n";
    
    // Monta os cabeçalhos do e-mail (essencial para o funcionamento)
    $headers = "From: " . $remetente_email . "\r\n";
    $headers .= "Reply-To: " . $email_remetente . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Tenta enviar o e-mail usando a função mail() do PHP
    if (mail($destinatario, $assunto, $corpo_email, $headers)) {
        // Se o envio foi bem-sucedido, redireciona o usuário para uma página de "obrigado"
        // É uma boa prática ter essa página para confirmar o envio ao usuário.
        header("Location: obrigado.html");
        exit;
    } else {
        // Se houve um problema no servidor ao tentar enviar
        http_response_code(500); // Código de erro "Internal Server Error"
        echo "<h1>Erro no Servidor</h1><p>Não foi possível enviar sua mensagem no momento. Tente novamente mais tarde.</p>";
    }
    
} else {
    // Se alguém tentar acessar o arquivo PHP diretamente pelo navegador
    http_response_code(403); // Código de erro "Forbidden"
    echo "<h1>Acesso Negado</h1><p>Você não tem permissão para acessar esta página diretamente.</p>";
}
?>