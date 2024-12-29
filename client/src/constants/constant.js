export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    python: "3.10.0",
    java: "15.0.2",
   
  };
  export const LANGUAGE_MODES = {
    javascript: "javascript",
    python: "python",
    java: "text/x-java",
  };
  export const CODE_SNIPPETS = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,

    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    csharp:
      'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  };