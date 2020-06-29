package ComicsFetch::xkcd;
use 5.030;
use strict;
use warnings;

sub get() {
    ::get_comic(
        'https://xkcd.com',
        'xkcd',
        undef,
        sub {
            my($tree) = @_;
            my($url, $extra);

            my $node = $tree->look_down(id => 'comic');
            if ($node) {
                my $img = $node->find('img');
                if ($img) {
                    my $title = $img->attr('title');
                    $url = 'https:' . $img->attr('src');
                    $extra = { title => $title }
                        if defined($title);
                }
            }

            return $url ? ($url, $extra) : ();
        }
    );
}

1;
